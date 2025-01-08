import { create } from "zustand";

const useLikedBandsStore = create((set, get) => ({
  likedBands: [],

  // Tilføj band til liked liste
  addBand: (band) => {
    const updatedBands = [...get().likedBands, band];
    set({ likedBands: updatedBands });
    localStorage.setItem("likedBands", JSON.stringify(updatedBands));

  },

  // Fjern band fra liked liste
  removeBand: (bandSlug) => {
    const updatedBands = get().likedBands.filter((b) => b.slug !== bandSlug);
    set({ likedBands: updatedBands });
    localStorage.setItem("likedBands", JSON.stringify(updatedBands));
  },

  // Indlæs bands fra localStorage
  loadLikedBands: () => {
    const savedBands = JSON.parse(localStorage.getItem("likedBands")) || [];
    set({ likedBands: savedBands });
  },

  // Kun få liked bands
  getLikedBands: () => get().likedBands,

  // Se om bandet er liket på dens slug
  isBandLiked: (slug) => get().likedBands.some((band) => band.slug === slug),
}));

export default useLikedBandsStore;





