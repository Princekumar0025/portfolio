const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const producer = kafka.producer();

class KafkaConfig {
    static async connect() {
        try {
            await producer.connect();
            console.log('✅ Connected to Kafka Broker');
        } catch (error) {
            console.error('❌ Kafka Connection Error:', error);
        }
    }

    static async publish(topic, key, value) {
        try {
            await producer.send({
                topic,
                messages: [{ key, value: JSON.stringify(value) }],
            });
        } catch (error) {
            console.error(`Failed to publish to ${topic}:`, error);
        }
    }
}

// In production, execute connect() on server startup
module.exports = KafkaConfig;
