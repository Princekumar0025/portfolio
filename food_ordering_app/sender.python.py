import socket

def sender():
    # UDP setup
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    client_socket.settimeout(2.0)  # 2-second timeout for ACK
    server_addr = ('127.0.0.1', 12345)

    packets = ["Packet A", "Packet B", "Packet C"]

    for i, data in enumerate(packets):
        ack_received = False
        while not ack_received:
            try:
                print(f"Sender: Sending {i} -> '{data}'")
                # Format: "sequence_number:data"
                message = f"{i}:{data}"
                client_socket.sendto(message.encode(), server_addr)

                # Wait for ACK
                msg, _ = client_socket.recvfrom(1024)
                ack_num = int(msg.decode().split(":")[1])

                if ack_num == i:
                    print(f"Sender: Received ACK for {i}\n")
                    ack_received = True
            except socket.timeout:
                print(f"Sender: Timeout! Resending {i}...")

    client_socket.close()

if __name__ == "__main__":
    sender()
