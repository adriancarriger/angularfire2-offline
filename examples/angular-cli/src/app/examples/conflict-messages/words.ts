export const Adjectives = [
  'alarming',
  'astonishing',
  'awe-inspiring',
  'awful',
  'beautiful',
  'breathtaking',
  'dreadful',
  'fearsome',
  'formidable',
  'frightening',
  'horrible',
  'horrifying',
  'imposing',
  'impressive',
  'intimidating',
  'magnificent',
  'overwhelming',
  'shocking',
  'stunning',
  'terrible',
  'terrifying',
  'wonderful',
  'wondrous',
  'daunting',
  'exalted',
  'fearful',
  'frantic',
  'grand',
  'hairy',
  'majestic',
  'mean',
  'mind-blowing',
  'moving',
  'nervous',
  'real gone',
  'something else',
  'striking',
  'stupefying',
  'zero cool'
];

export const Random = {
  get adjective() {
    return Adjectives[Math.floor(Math.random() * (Adjectives.length - 1))];
  }
};
