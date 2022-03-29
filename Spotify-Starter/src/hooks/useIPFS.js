//  This hook gets the url by looking for the sring "ipfs://"
//  once found, it ensures that its played correctly by replacing
//  the sring with an ipfs gateway. the resullting link is played

export const useIPFS = () => {
    const resolveLink = (url) => {
      if (!url || !url.includes("ipfs://")) return url;
      return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
    };
  
    return { resolveLink };
  };
