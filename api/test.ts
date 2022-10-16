const msg = 'Hello world ;)';
const unusedVal = 'nobody uses me:(';
console.log('Message: ', msg);

export default function handler(req: any, res: any) {
  res.status(200).send({ msg });
}
