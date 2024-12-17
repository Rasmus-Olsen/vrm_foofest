"use client";

import React, { useState, useEffect } from "react";
import useBookingStore from "@/stores/useBookingStore";
import { getCampingAreas } from "@/lib/database";

const Camping = ({ onNext, onBack }) => {
  const tickets = useBookingStore((state) => state.tickets);
  const campingSelection = useBookingStore((state) => state.campingSelection);
  const updateCampingSelection = useBookingStore(
    (state) => state.updateCampingSelection
  );
  const [areaError, setAreaError] = useState("");

  const totalTickets = tickets.reduce(
    (total, ticket) => total + ticket.quantity,
    0
  );

  const totalTents =
    campingSelection.tents.twoPerson + campingSelection.tents.threePerson;

  useEffect(() => {
    const fetchCampingAreas = async () => {
      const areas = await getCampingAreas();
      const formattedAreas = areas.map((area) => ({
        area: area.name || area.area,
        available: area.available, // Tilgængelige pladser
      }));

      updateCampingSelection({ areas: formattedAreas });
    };

    fetchCampingAreas();
  }, [updateCampingSelection]);

  useEffect(() => {
    if (campingSelection.area) {
      const selectedArea = campingSelection.areas.find(
        (area) => area.area === campingSelection.area
      );
      if (selectedArea && totalTents > selectedArea.available) {
        updateCampingSelection({ area: null });
        setAreaError(
          "There are not enough places for the selected tents. Select another area."
        ); // Sæt fejlbesked
      } else {
        setAreaError("");
      }
    }
  }, [
    totalTents,
    campingSelection.area,
    campingSelection.areas,
    updateCampingSelection,
  ]);

  const handleTentChange = (type, value) => {
    const updatedTents = { ...campingSelection.tents };
    const newValue = Math.max(0, value);

    updatedTents[type] = newValue;

    const totalTents = updatedTents.twoPerson + updatedTents.threePerson;

    if (totalTents > totalTickets) {
      return;
    }

    updateCampingSelection({ tents: updatedTents });
  };

  const toggleGreenCamping = () => {
    updateCampingSelection({ greenCamping: !campingSelection.greenCamping });
  };

  const handleAreaSelect = (selectedArea) => {
    if (campingSelection.area === selectedArea.area) {
      updateCampingSelection({ area: null });
    } else {
      updateCampingSelection({ area: selectedArea.area });
    }
  };

  const canProceedToPayment = totalTents > 0 && campingSelection.area;

  const onNextHandler = () => {
    onNext(totalTents);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-primary">
        Select Camping Area
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {campingSelection.areas?.map((area) => (
          <button
            key={area.area}
            className={`p-4 border rounded-xl ${
              campingSelection.area === area.area
                ? "border-primary"
                : "border-gray-500"
            } ${
              area.available < totalTents || area.available === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() =>
              area.available >= totalTents && handleAreaSelect(area)
            }
            disabled={area.available < totalTents || area.available === 0}
          >
            <h3 className="text-lg font-semibold">{area.area}</h3>
            <p
              className={`${
                area.available === 0 || area.available < totalTents
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {area.available === 0 || area.available < totalTents
                ? "Not enough space"
                : `${area.available} Vacant Places`}
            </p>
          </button>
        ))}
      </div>

      {areaError && <p className="text-red-500 text-sm mt-4">{areaError}</p>}
      <h2 className="text-2xl font-bold mb-4 mt-8 text-primary">
        Choose tents
      </h2>

      <div className="flex justify-between items-center mb-4">
        <p>2 Person Tent</p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() =>
              handleTentChange(
                "twoPerson",
                campingSelection.tents.twoPerson - 1
              )
            }
            className="flex items-center justify-center border border-primary text-white rounded-full bg-black hover:bg-primary text-lg transition focus:outline-none h-[32px] w-[32px] cursor-pointer"
            disabled={campingSelection.tents.twoPerson <= 0}
          >
            -
          </button>
          <input
            type="number"
            value={campingSelection.tents.twoPerson}
            onChange={(e) =>
              handleTentChange("twoPerson", parseInt(e.target.value, 10) || 0)
            }
            className="w-16 text-center border border-primary text-white bg-black text-lg focus:outline-none focus:ring-0"
            min="0"
          />
          <button
            onClick={() =>
              handleTentChange(
                "twoPerson",
                campingSelection.tents.twoPerson + 1
              )
            }
            className="flex items-center justify-center bg-primary border border-primary text-white rounded-full hover:bg-black text-lg transition focus:outline-none h-[32px] w-[32px] cursor-pointer"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <p>3 Person Tent</p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() =>
              handleTentChange(
                "threePerson",
                campingSelection.tents.threePerson - 1
              )
            }
            className="flex items-center justify-center border border-primary text-white rounded-full bg-black hover:bg-primary text-lg transition focus:outline-none h-[32px] w-[32px] cursor-pointer"
            disabled={campingSelection.tents.threePerson <= 0}
          >
            -
          </button>
          <input
            type="number"
            value={campingSelection.tents.threePerson}
            onChange={(e) =>
              handleTentChange("threePerson", parseInt(e.target.value, 10) || 0)
            }
            className="w-16 text-center border border-primary text-white bg-black text-lg focus:outline-none focus:ring-0"
            min="0"
          />
          <button
            onClick={() =>
              handleTentChange(
                "threePerson",
                campingSelection.tents.threePerson + 1
              )
            }
            className="flex items-center justify-center bg-primary border border-primary text-white rounded-full hover:bg-black text-lg transition focus:outline-none h-[32px] w-[32px] cursor-pointer"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          id="greenCamping"
          checked={campingSelection.greenCamping}
          onChange={toggleGreenCamping}
          className="border border-primary text-primary w-5 h-5 rounded-md bg-black focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <label htmlFor="greenCamping" className="text-lg text-white ml-2">
          Green Camping
        </label>
      </div>

      <hr className="border-primary my-6" />

      <div className="flex justify-between mt-4">
        <button
          onClick={onBack}
          className="px-10 py-2 border border-primary text-white rounded-full"
        >
          Back
        </button>
        <button
          onClick={onNextHandler}
          className={`px-10 py-2 bg-primary border border-primary text-white rounded-full ${
            !canProceedToPayment ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!canProceedToPayment}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Camping;
