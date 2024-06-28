import React, { useState } from 'react';
import axios from 'axios';
import './PlayerLookup.css';

const PlayerLookup = () => {
  const [playerName, setPlayerName] = useState('');
  const [playerData, setPlayerData] = useState(null);
  const [error, setError] = useState(null);

  const handleLookup = async () => {
    try {
      const response = await axios.get(`/api/players/${playerName}/stats/builds`);
      console.log(response.data); // Log the response data
      setPlayerData(response.data);
      setError(null);
    } catch (err) {
      setError('Player not found or API error');
      setPlayerData(null);
    }
  };

  const renderBuildItem = (item, type) => (
    item[type].en_name && (
      <div className="build-item">
        <img
          src={`/images/${item[type].en_name}.png`}
          alt={item[type].en_name}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <span>{item[type].en_name}</span>
      </div>
    )
  );

  const renderPlayerData = (data) => {
    if (!data || !data.builds) {
      return <div>No data available or data is not in the expected format.</div>;
    }
    return (
      <div>
        {data.builds.map((build, index) => (
          <div key={index} className="player-data-item">
            <h3>Build {index + 1}</h3>
            <div className="build-items">
              {renderBuildItem(build.build, 'main_hand')}
              {renderBuildItem(build.build, 'off_hand')}
              {renderBuildItem(build.build, 'head')}
              {renderBuildItem(build.build, 'body')}
              {renderBuildItem(build.build, 'shoe')}
              {renderBuildItem(build.build, 'cape')}
            </div>
            <div className="build-stats">
              <p>Usages: {build.usages}</p>
              <p>Average Item Power: {build.average_item_power.toFixed(2)}</p>
              <p>Kill Fame: {build.kill_fame}</p>
              <p>Death Fame: {build.death_fame}</p>
              <p>Kills: {build.kills}</p>
              <p>Deaths: {build.deaths}</p>
              <p>Assists: {build.assists}</p>
              <p>Fame Ratio: {build.fame_ratio ? build.fame_ratio.toFixed(2) : 'N/A'}</p>
              <p>Win Rate: {(build.win_rate * 100).toFixed(2)}%</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="player-lookup">
      <h1>Player Lookup</h1>
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter player name"
      />
      <button onClick={handleLookup}>Lookup Player</button>
      {error && <div className="error">{error}</div>}
      {playerData && (
        <div className="player-data">
          <h2>Player Data for {playerData.player_name}</h2>
          {renderPlayerData(playerData)}
        </div>
      )}
    </div>
  );
};

export default PlayerLookup;
