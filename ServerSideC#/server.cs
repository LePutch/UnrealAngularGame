using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

public class Startup
{
    private readonly Dictionary<Guid, WebSocket> connections = new Dictionary<Guid, WebSocket>();
    private readonly Dictionary<string, List<Guid>> rooms = new Dictionary<string, List<Guid>>();

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddWebSocketManager();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseWebSockets();
        app.UseWebSocketManager();

        app.Run(async (context) =>
        {
            if (context.Request.Path == "/")
            {
                if (context.WebSockets.IsWebSocketRequest)
                {
                    WebSocket socket = await context.WebSockets.AcceptWebSocketAsync();
                    Guid socketId = Guid.NewGuid();
                    connections[socketId] = socket;

                    Console.WriteLine($"Socket {socketId} connected");

                    await SendAsync(socket, new { type = "success", message = "Connexion réussie !" });

                    await ReceiveMessagesAsync(socket, socketId);
                }
                else
                {
                    context.Response.StatusCode = 400;
                }
            }
        });
    }

    private async Task ReceiveMessagesAsync(WebSocket socket, Guid socketId)
    {
        byte[] buffer = new byte[1024];
        WebSocketReceiveResult result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

        while (!result.CloseStatus.HasValue)
        {
            string message = Encoding.UTF8.GetString(buffer, 0, result.Count);

            try
            {
                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(message);
                Console.WriteLine($"Received message from socket {socketId}: {message}");

                if (data.type == "createRoom")
                {
                    string roomCode = Guid.NewGuid().ToString().Substring(0, 6);
                    Console.WriteLine($"roomCode {roomCode}");
                    rooms[roomCode] = new List<Guid> { socketId };

                    List<string> ips = GetIP();
                    if (ips.Count > 0)
                    {
                        GenerateQRCode(ips[0], roomCode);
                        await SendAsync(socket, new { type = "roomCreated", roomCode });
                    }
                    else
                    {
                        await SendAsync(socket, new { type = "roomCreatedFailed", roomCode });
                    }
                }
                else if (data.type == "joinRoom")
                {
                    string roomCode = data.roomCode;
                    if (rooms.ContainsKey(roomCode))
                    {
                        List<Guid> room = rooms[roomCode];
                        if (!room.Contains(socketId))
                        {
                            room.Add(socketId);
                            rooms[roomCode] = room;

                            await SendAsync(socket, new { type = "roomJoined", message = "Vous avez rejoint la salle." });

                            Guid otherSocketId = room.First(id => id != socketId);
                            WebSocket otherSocket = connections[otherSocketId];
                            if (otherSocket != null)
                            {
                                await SendAsync(otherSocket, new { type = "partnerJoined", message = "Votre partenaire a rejoint la salle." });
                            }
                            else
                            {
                                await SendAsync(socket, new { type = "partnerDisconnected", message = "Votre partenaire s'est déconnecté." });
                            }
                        }
                    }
                    else
                    {
                        await SendAsync(socket, new { type = "error", message = "Salle introuvable." });
                    }
                }
                else if (data.type == "chat")
                {
                    string roomCode = rooms.FirstOrDefault(x => x.Value.Contains(socketId)).Key;
                    if (roomCode != null)
                    {
                        List<Guid> roomSockets = rooms[roomCode];
                        foreach (Guid roomId in roomSockets)
                        {
                            WebSocket roomSocket = connections[roomId];
                            if (roomSocket != null)
                            {
                                await SendAsync(roomSocket, new { type = "chat", message = data.content });
                            }
                        }
                    }
                    else
                    {
                        // Le socket ne fait pas partie d'une salle, traitement alternatif...
                    }
                }
                else if (data.type == "jump")
                {
                    string roomCode = rooms.FirstOrDefault(x => x.Value.Contains(socketId)).Key;
                    if (roomCode != null)
                    {
                        List<Guid> roomSockets = rooms[roomCode];
                        foreach (Guid roomId in roomSockets)
                        {
                            WebSocket roomSocket = connections[roomId];
                            if (roomSocket != null)
                            {
                                await SendAsync(roomSocket, new { type = "jump" });
                            }
                        }
                    }
                    else
                    {
                        // Le socket ne fait pas partie d'une salle, traitement alternatif...
                    }
                }
                else
                {
                    // Traitements pour les autres types de messages
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error parsing JSON: {ex}");
            }

            result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        }

        Console.WriteLine($"Socket {socketId} disconnected");
        connections.Remove(socketId);

        foreach (var roomPair in rooms.ToList())
        {
            string roomCode = roomPair.Key;
            List<Guid> room = roomPair.Value;

            int index = room.IndexOf(socketId);
            if (index != -1)
            {
                room.RemoveAt(index);
                if (room.Count == 0)
                {
                    rooms.Remove(roomCode);
                }
                else
                {
                    rooms[roomCode] = room;
                }

                int otherSocketIndex = index == 0 ? 1 : 0;
                Guid otherSocketId = room[otherSocketIndex];
                WebSocket otherSocket = connections.GetValueOrDefault(otherSocketId);

                if (otherSocket != null)
                {
                    if (socketId == roomPair.Value[0])
                    {
                        foreach (Guid roomId in room)
                        {
                            WebSocket roomSocket = connections.GetValueOrDefault(roomId);
                            if (roomSocket != null)
                            {
                                await SendAsync(roomSocket, new { type = "creatorDisconnected", message = "Le créateur s'est déconnecté." });
                            }
                        }
                    }
                    else
                    {
                        foreach (Guid roomId in room)
                        {
                            WebSocket roomSocket = connections.GetValueOrDefault(roomId);
                            if (roomSocket != null)
                            {
                                await SendAsync(roomSocket, new { type = "partnerDisconnected", message = "Votre partenaire s'est déconnecté." });
                            }
                        }
                    }
                }

                if (room.Count == 0)
                {
                    rooms.Remove(roomCode);
                    Console.WriteLine($"Room deleted: {roomCode}");
                }
                break;
            }
        }
    }

    private List<string> GetIP()
    {
        List<string> ipv4Addresses = new List<string>();
        foreach (var netInterface in NetworkInterface.GetAllNetworkInterfaces())
        {
            if (netInterface.NetworkInterfaceType == NetworkInterfaceType.Ethernet &&
                !netInterface.Description.ToLowerInvariant().Contains("virtual") &&
                !netInterface.Description.ToLowerInvariant().Contains("pseudo"))
            {
                foreach (var address in netInterface.GetIPProperties().UnicastAddresses)
                {
                    if (address.Address.AddressFamily == AddressFamily.InterNetwork)
                    {
                        ipv4Addresses.Add(address.Address.ToString());
                    }
                }
            }
        }
        return ipv4Addresses;
    }

    private void GenerateQRCode(string ip, string roomCode)
    {
        string link = $"http://{ip}:8123?room={roomCode}";

        // Code de génération de QR code ici
    }

    private static async Task SendAsync(WebSocket socket, object data)
    {
        string message = Newtonsoft.Json.JsonConvert.SerializeObject(data);
        byte[] buffer = Encoding.UTF8.GetBytes(message);
        await socket.SendAsync(new ArraySegment<byte>(buffer, 0, buffer.Length), WebSocketMessageType.Text, true, CancellationToken.None);
    }
}

public static class WebSocketExtensions
{
    public static IApplicationBuilder UseWebSocketManager(this IApplicationBuilder app)
    {
        return app.UseMiddleware<WebSocketManagerMiddleware>();
    }
}

public class WebSocketManagerMiddleware
{
    private readonly RequestDelegate next;
    private WebSocketHandler webSocketHandler { get; set; }

    public WebSocketManagerMiddleware(RequestDelegate next, WebSocketHandler webSocketHandler)
    {
        this.next = next;
        this.webSocketHandler = webSocketHandler;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (!context.WebSockets.IsWebSocketRequest)
        {
            await next(context);
            return;
        }

        var socket = await context.WebSockets.AcceptWebSocketAsync();
        await webSocketHandler.OnConnected(socket);

        await Receive(socket);

        await webSocketHandler.OnDisconnected(socket);
    }

    private async Task Receive(WebSocket socket)
    {
        var buffer = new byte[1024 * 4];
        WebSocketReceiveResult result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

        while (!result.CloseStatus.HasValue)
        {
            await webSocketHandler.ReceiveAsync(socket, result, buffer);
            result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        }
    }
}

public abstract class WebSocketHandler
{
    public abstract Task OnConnected(WebSocket socket);

    public abstract Task OnDisconnected(WebSocket socket);

    public async Task SendMessageAsync(WebSocket socket, string message)
    {
        if (socket.State != WebSocketState.Open)
            return;

        var buffer = Encoding.UTF8.GetBytes(message);
        await socket.SendAsync(new ArraySegment<byte>(buffer, 0, buffer.Length), WebSocketMessageType.Text, true, CancellationToken.None);
    }

    public async Task SendObjectAsync(WebSocket socket, object obj)
    {
        string json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
        await SendMessageAsync(socket, json);
    }

    public async Task ReceiveAsync(WebSocket socket, WebSocketReceiveResult result, byte[] buffer)
    {
        if (result.MessageType == WebSocketMessageType.Text)
        {
            string message = Encoding.UTF8.GetString(buffer, 0, result.Count);
            await HandleMessage(socket, message);
        }
    }

    public abstract Task HandleMessage(WebSocket socket, string message);
}

public class WebSocketManager
{
    private readonly Dictionary<Guid, WebSocket> sockets = new Dictionary<Guid, WebSocket>();
    private readonly object socketLock = new object();

    public event EventHandler<string> SocketConnected;
    public event EventHandler<string> SocketDisconnected;

    public WebSocket GetSocketById(Guid id)
    {
        lock (socketLock)
        {
            return sockets.GetValueOrDefault(id);
        }
    }

    public IEnumerable<WebSocket> GetAllSockets()
    {
        lock (socketLock)
        {
            return sockets.Values;
        }
    }

    public void AddSocket(WebSocket socket)
    {
        lock (socketLock)
        {
            Guid id = Guid.NewGuid();
            sockets[id] = socket;
            SocketConnected?.Invoke(this, id.ToString());
        }
    }

    public async Task RemoveSocketAsync(Guid id)
    {
        lock (socketLock)
        {
            if (sockets.ContainsKey(id))
            {
                sockets.Remove(id);
                SocketDisconnected?.Invoke(this, id.ToString());
            }
        }
    }
}
