import { create } from "zustand";

const useLikedBandsStore = create((set, get) => ({
  likedBands: [],

  addBand: (band) => {
    const updatedBands = [...get().likedBands, band];
    set({ likedBands: updatedBands });
    localStorage.setItem("likedBands", JSON.stringify(updatedBands));
  },

  removeBand: (bandSlug) => {
    const updatedBands = get().likedBands.filter((b) => b.slug !== bandSlug);
    set({ likedBands: updatedBands });
    localStorage.setItem("likedBands", JSON.stringify(updatedBands));
  },

  loadLikedBands: () => {
    const savedBands = JSON.parse(localStorage.getItem("likedBands")) || [];
    set({ likedBands: savedBands });
  },
}));

export default useLikedBandsStore;