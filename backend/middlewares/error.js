import { EventEmitter } from 'node:events';

export default function errorHandler(err, req, res, next){
    console.log('Error Middleware: ');
    console.error(err.stack);
    res.status(500).json({error: err.message});
};

const myEmitter = new EventEmitter();
myEmitter.on('error', (err) => {
  console.error('Handled emitter error:', err);
});
//myEmitter.emit('error', new Error('Oops'));

process.on('uncaughtException', (error) => {
  console.log(`Worker ${process.pid} encountered an error`, error);
  process.emit('disconnect');
  process.exit(1);
});
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
  process.exit(1);
});

  