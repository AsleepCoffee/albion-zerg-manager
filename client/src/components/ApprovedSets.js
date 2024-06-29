import React, { useState } from 'react';
import './ApprovedSets.css';
import imageList from './imageList';

const ApprovedSets = () => {
  const [selectedImages, setSelectedImages] = useState({
    bag: null,
    cape: null,
    helm: null,
    weapon: null,
    offhand: null,
    chest: null,
    boots: null,
  });

  const handleImageChange = (slot, event) => {
    setSelectedImages({
      ...selectedImages,
      [slot]: event.target.value,
    });
  };

  return (
    <div className="approved-sets">
      <div className="dropdowns">
        <label>
          Bag:
          <select onChange={(event) => handleImageChange('bag', event)}>
            <option value="">Select an image</option>
            {imageList.map((image) => (
              <option key={image} value={image}>{image}</option>
            ))}
          </select>
        </label>
        <label>
          Cape:
          <select onChange={(event) => handleImageChange('cape', event)}>
            <option value="">Select an image</option>
            {imageList.map((image) => (
              <option key={image} value={image}>{image}</option>
            ))}
          </select>
        </label>
        <label>
          Helm:
          <select onChange={(event) => handleImageChange('helm', event)}>
            <option value="">Select an image</option>
            {imageList.map((image) => (
              <option key={image} value={image}>{image}</option>
            ))}
          </select>
        </label>
        <label>
          Weapon:
          <select onChange={(event) => handleImageChange('weapon', event)}>
            <option value="">Select an image</option>
            {imageList.map((image) => (
              <option key={image} value={image}>{image}</option>
            ))}
          </select>
        </label>
        <label>
          Offhand:
          <select onChange={(event) => handleImageChange('offhand', event)}>
            <option value="">Select an image</option>
            {imageList.map((image) => (
              <option key={image} value={image}>{image}</option>
            ))}
          </select>
        </label>
        <label>
          Chest:
          <select onChange={(event) => handleImageChange('chest', event)}>
            <option value="">Select an image</option>
            {imageList.map((image) => (
              <option key={image} value={image}>{image}</option>
            ))}
          </select>
        </label>
        <label>
          Boots:
          <select onChange={(event) => handleImageChange('boots', event)}>
            <option value="">Select an image</option>
            {imageList.map((image) => (
              <option key={image} value={image}>{image}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="image-container">
        <img src="/images/EquipmentBackdrop.png" alt="Equipment Background" className="background-image" />
        {selectedImages.bag && (
          <img src={`/images/${selectedImages.bag}.png`} alt="Selected Bag" className="bag-image" />
        )}
        {selectedImages.cape && (
          <img src={`/images/${selectedImages.cape}.png`} alt="Selected Cape" className="cape-image" />
        )}
        {selectedImages.helm && (
          <img src={`/images/${selectedImages.helm}.png`} alt="Selected Helm" className="helm-image" />
        )}
        {selectedImages.weapon && (
          <img src={`/images/${selectedImages.weapon}.png`} alt="Selected Weapon" className="weapon-image" />
        )}
        {selectedImages.offhand && (
          <img src={`/images/${selectedImages.offhand}.png`} alt="Selected Offhand" className="offhand-image" />
        )}
        {selectedImages.chest && (
          <img src={`/images/${selectedImages.chest}.png`} alt="Selected Chest" className="chest-image" />
        )}
        {selectedImages.boots && (
          <img src={`/images/${selectedImages.boots}.png`} alt="Selected Boots" className="boots-image" />
        )}
      </div>
    </div>
  );
};

export default ApprovedSets;
