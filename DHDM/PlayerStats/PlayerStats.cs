﻿//#define profiling
using DndCore;
using System;
using System.Linq;
using System.Collections.Generic;

namespace DHDM
{
	public class PlayerStats
	{
		public List<DiceStackDto> DiceStack { get; set; } = new List<DiceStackDto>();
		public bool ReadyToRollDice { get; set; }
		public VantageKind Vantage { get; set; }
		public int PlayerId { get; set; }
		public PlayerStats()
		{

		}

		public PlayerStats(int playerId)
		{
			PlayerId = playerId;
		}

		public void AddRoll(Roll roll)
		{
			DiceStack.Add(new DiceStackDto(roll));
		}

		public void AddD20()
		{
			DiceStack.Add(new DiceStackDto() { NumSides = 20 });
		}
		public void ClearDiceStack()
		{
			DiceStack.Clear();
		}
	}
}

// HubtasticBaseStation.ChangePlayerHealth(JsonConvert.SerializeObject(damageHealthChange));