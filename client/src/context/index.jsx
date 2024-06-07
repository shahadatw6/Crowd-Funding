import React, { createContext, useContext, useState } from "react";
import { useContract, useContractWrite, useAddress, useMetamask } from "@thirdweb-dev/react";
import { ethers } from "ethers";

// Create a new context
const StateContext = createContext();

// Create a provider component
export const StateContextProvider = ({ children }) => {
  const [state, setState] = useState({});

  // Get the contract instance
  const { contract } = useContract("0x2202cAf26366C9A656DcaeE732120045Be649008");
  const { mutateAsync: createCampaign } = useContractWrite(contract, "createCampaign");

  const address = useAddress();
  const connect = useMetamask();

  // Function to publish a campaign
  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [
          address, // owner
          form.title, // title
          form.description, // description
          form.target,
          new Date(form.deadline).getTime(), // deadline,
          form.image,
        ],
      });

      console.log("contract call success", data);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  // Function to get campaigns
  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i
    }));

    return parsedCampaings;
  };

  // Function to get user campaigns
  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();
    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);
    return filteredCampaigns;
  };

  // Function to donate to a campaign
  const donate = async (pId, amount) => {
    const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount)});
    return data;
  };

  // Function to get donations
  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];
    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      });
    }

    return parsedDonations;
  };

  // Provide state and functions to children
  return (
    <StateContext.Provider
      value={{
        state,
        setState,
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// Custom hook to use the context
export const useStateContext = () => useContext(StateContext);
