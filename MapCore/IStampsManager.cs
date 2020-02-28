﻿using System;
using System.Linq;
using System.Windows;
using System.Collections.Generic;
using MapCore;

namespace MapCore
{
	public interface IStampsManager
	{
		void AddItem(IItemProperties stamp);
		void AddStamps(List<IStampProperties> stamps);

		/// <summary>
		/// Gets the stamp at the specified point if the stamp contains non-transparent 
		/// image data at this point.
		/// </summary>
		/// <returns>Returns the stamp if found, or null.</returns>
		IStampProperties GetStampAt(double x, double y);
		IItemProperties GetItemAt(double x, double y);
		void InsertStamp(int startIndex, IStampProperties stamp);
		void InsertStamps(int startIndex, List<IStampProperties> stamps);
		void RemoveAllStamps(List<IStampProperties> stamps);
		void RemoveItem(IItemProperties item);
		void SortStampsByZOrder(int zOrderOffset = 0);
		void NormalizeZOrder(int zOrderOffset = 0);
		List<IItemProperties> Stamps { get; set; }
	}
}

