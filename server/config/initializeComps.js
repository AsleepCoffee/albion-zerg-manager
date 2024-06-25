const Comp = require('../models/Comp');

const defaultComps = [
  {
    name: 'Default Comp',
    slots: [
      'Earthrune or 1H Mace',
      'H. Mace',
      'Bedrock w/ Mistcaller',
      '1H.Hammer w/ Leering',
      'Chariot',
      'Oathkeepers',
      'Locus',
      'Rootbound',
      'Lifecurse w/ Aegis',
      'Hallowfall w/ Mistcaller',
      'Hallowfall w/ Mistcaller',
      'Hallowfall w/ Mistcaller',
      'Blight',
      'Damnation',
      'Realmbreaker',
      'Spirithunter',
      'Spiked Guant',
      'Infernal Scythe',
      'Infernal Scythe',
      'Perma',
    ],
  },
];

const initializeDefaultComps = async () => {
  try {
    const existingComps = await Comp.find({});
    if (existingComps.length === 0) {
      await Comp.insertMany(defaultComps);
      console.log('Default comps initialized');
    }
  } catch (error) {
    console.error('Error initializing default comps:', error);
  }
};

module.exports = initializeDefaultComps;
