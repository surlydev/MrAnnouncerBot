﻿using System;
using System.Linq;
using System.Windows;
using System.Collections.Generic;
using MapCore;

namespace DndMapSpike
{
	public class StampsLayer : Layer
	{
		public IStampsManager Map { get; set; }
		public List<IStampProperties> Stamps { get => Map.Stamps; set => Map.Stamps = value; }

		int updateCount;

		public StampsLayer()
		{
		}

		public void BlendStampImage(IFloatingItem floatingItem, double xOffset = 0, double yOffset = 0)
		{
			double x = floatingItem.GetLeft() + xOffset;
			double y = floatingItem.GetTop() + yOffset;
			BlendImage(floatingItem.Image, x, y);
		}

		void Refresh()
		{
			ClearAll();
			foreach (IStampProperties stamp in Map.Stamps)
			{
				try
				{
					if (stamp is IFloatingItem floatingItem)
						floatingItem.BlendStampImage(this);
				}
				catch
				{
					// TODO: Error placing stamp (likely out of bounds) - should we save it/remove it?
				}
			}

			foreach (IItemProperties item in Map.Characters)
			{
				try
				{
					if (item is IFloatingItem floatingItem)
						floatingItem.BlendStampImage(this);
					//if (item is MapCharacter character)
					//{
					//	double x = character.GetLeft();
					//	double y = character.GetTop();
					//	BlendImage(character.Image, x, y);
					//}
				}
				catch
				{
					// TODO: Error placing character (likely out of bounds) - should we save it/remove it?
				}
			}
		}

		public void BeginUpdate()
		{
			updateCount++;
		}

		public void EndUpdate()
		{
			updateCount--;
			if (updateCount == 0)
			{
				Map.SortStampsByZOrder();
				Map.NormalizeZOrder();
				Refresh();
			}
		}

		/// <summary>
		/// Gets the stamp at the specified point if the stamp contains non-transparent 
		/// image data at this point.
		/// </summary>
		/// <returns>Returns the stamp if found, or null.</returns>
		public IStampProperties GetStampAt(double x, double y)
		{
			return Map.GetStampAt(x, y);
		}

		public IItemProperties GetItemAt(double x, double y)
		{
			return Map.GetItemAt(x, y);
		}
	}
}

