# 🤖 CyberKidz Club: Wasteland Expedition

## 🌍 Project Overview

**CyberKidz: Wasteland Expedition** is a casual Action Point (AP) and Movement Point (MP) strategy game designed for the **CyberKidz Club** community. It integrates the rich lore of the Tezos NFT project, allowing players to utilize their NFTs to collect vital resources, upgrade their Kidz, and prepare for the final Siege of Cyber City.

### 🔗 Game Link

The game is hosted for free via GitHub Pages:

**[YOUR GAME LINK HERE]**
`https://vexoriaai.github.io/cyberkidz-expeditions/`

---

## 📜 The Lore: Beyond The Dome

[cite_start]The year is 2420. The world, as it was known, collapsed due to the excessive number of Proof-of-Work NFT mints[cite: 45]. [cite_start]Only 6,666 children survived and reside in a utopian citadel called **Cyber City**, protected by a dome[cite: 46, 48].

[cite_start]However, the children deemed surplus or inadequate by the Central A.I. were exiled into the **Wasteland** (*Beyond The Dome*)[cite: 391, 398, 404]. [cite_start]Hundreds of years of radiation and accelerated mutations transformed these exiles into five powerful **Tribes**[cite: 156, 405]:

* [cite_start]**Volcanics** (Masters of the forges, inhabiting the peaks of Burning Ridge)[cite: 162, 163, 407].
* [cite_start]**Undergrounders** (Digging deep for clean water, adapted to darkness)[cite: 169, 412].
* [cite_start]**Reptilians** (Highly adapted hunters from the Covenant Swamp)[cite: 186, 417].
* [cite_start]**Radioactives** (The most mutated and wreckless tribe from Lake Rancid)[cite: 177, 421].
* [cite_start]**Nocturnals** (Technologically advanced assassins, followers of the Code of Night)[cite: 191, 426, 428].

[cite_start]These tribes have put aside their differences to form **The Union**, preparing for an epic war to achieve a more efficient and fair resource distribution[cite: 158, 160, 434, 435].

---

## 🎮 Game Mechanics (AP & MP)

The game features a system based on **10 Days of Expedition** (Turns) where the player must strategically manage their Action Points (AP) and Movement Points (MP).

### 1. NFT Selection & Idle Mode

1.  Click **"Connect Wallet"** (Simulated).
2.  Select **ONE** NFT for the **Active Expedition**. This Kid is your main character, utilizing AP/MP on the map.
3.  Select up to **NINE** other NFTs for the **Idle Expedition**. These inactive Kidz generate passive resources (Scrap) at the end of each day.

### 2. Gameplay Flow

| Action | Cost | Effect |
| :--- | :--- | :--- |
| **Move** (Click Adjacent Cell) | 1 MP | Repositions the Active Kid. Does NOT end the day. |
| **Collect Resource** | 1 AP | Gathers the primary resource of the current Biome (Scrap, Water, or Food). |
| **Investigate** | 1 AP | Attempts to find rare items. Has a chance to trigger combat with an enemy. |
| **Call Attention** | 2 AP | Guarantees a combat encounter for potentially higher rewards. |
| **Upgrade** (Button) | 10 ALL Resources | Permanently increases the Active Kid's **Strength** and **Max HP** (resets HP to Max). |

### 3. End of Day / Recharge

Clicking **"END DAY / RECHARGE"** advances the expedition to the next day.

* The Active Kid's **AP** and **MP** are fully restored.
* The **Idle Kidz** collect their passive resource gains (currently Scrap).

---

## ⚙️ Technical Details and Roadmap

### Technologies Used

* **Frontend:** HTML, CSS (Vanilla), JavaScript (Vanilla)
* **Hosting:** GitHub Pages
* **Blockchain Integration (Planned):** Tezos

### 📈 Future Roadmap (Phase 4)

* **Real Web3 Integration:** Connecting to the Tezos Wallet (e.g., using Beacon SDK or Taquito) to verify NFT ownership.
* **Tokenomics Implementation:** Enabling the *Claim* feature where collected resources are converted into an actual on-chain Token reward.
* **Persistence:** Saving the Kid's Upgrades and Expedition Progress via wallet ID or NFT metadata updates.
