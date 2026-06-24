import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/orders',
})
export class SocketsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<string, string> = new Map(); // socketId -> userId/restaurantId

  handleConnection(client: Socket) {
    console.log(`Client Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client Disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() data: { id: string; role: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Rooms can be used to broadcast to specific restaurants or riders
    const roomName = `${data.role}_${data.id}`;
    client.join(roomName);
    this.connectedClients.set(client.id, data.id);
    return { event: 'registered', status: 'success', room: roomName };
  }

  // Called by HTTP REST controllers or other services to push updates
  notifyRestaurantNewOrder(restaurantId: string, orderData: any) {
    this.server.to(`RESTAURANT_${restaurantId}`).emit('new_order', orderData);
  }

  notifyCustomerOrderStatus(customerId: string, statusUpdate: any) {
    this.server.to(`CUSTOMER_${customerId}`).emit('order_status_update', statusUpdate);
  }

  @SubscribeMessage('rider_location_update')
  handleRiderLocationUpdate(
    @MessageBody() data: { riderId: string; orderId: string; lat: number; lng: number },
    @ConnectedSocket() client: Socket,
  ) {
    // Broadcast rider location to the specific order room so the customer sees it live
    this.server.to(`ORDER_${data.orderId}`).emit('rider_location', {
      lat: data.lat,
      lng: data.lng,
    });
  }
}
