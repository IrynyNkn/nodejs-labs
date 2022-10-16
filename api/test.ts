const msg = 'Hello world ;)';

export default function handler(req: any, res: any) {
  res.status(200).send({ msg });
}
