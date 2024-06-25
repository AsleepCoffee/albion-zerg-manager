// server/controllers/compController.js

let comps = [
  {
    name: 'Default Comp',
    slots: [
      'Earthrune or 1H Mace', 'H. Mace', 'Bedrock w/ Mistcaller', '1H.Hammer w/ Leering', 
      'Chariot', 'Oathkeepers', 'Locus', 'Rootbound', 'Lifecurse w/ Aegis', 
      'Hallowfall w/ Mistcaller', 'Hallowfall w/ Mistcaller', 'Hallowfall w/ Mistcaller', 
      'Blight', 'Damnation', 'Realmbreaker', 'Spirithunter', 'Spiked Gaunt', 
      'Infernal Scythe', 'Infernal Scythe', 'Perma'
    ]
  }
];

exports.getComps = (req, res) => {
  res.json(comps);
};

exports.saveComp = (req, res) => {
  const { name, slots } = req.body;
  const compIndex = comps.findIndex(comp => comp.name === name);

  if (compIndex > -1) {
    comps[compIndex] = { name, slots };
  } else {
    comps.push({ name, slots });
  }

  res.status(200).json({ message: 'Comp saved successfully!' });
};
