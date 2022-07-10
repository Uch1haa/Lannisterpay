class Compute {
  balance;
  totalRatio;
  totalRatioBalance;

  // Split Flat values
  splitByFlat(val) {
    this.balance -= val;
    return val;
  }

  // Split Percentage values
  splitByPercentage(val) {
    const solvedPercentageAmount = (val / 100) * this.balance;
    this.balance -= solvedPercentageAmount;
    return solvedPercentageAmount;
  }

  // Split Ratio values
  splitByRatio(val) {
    const solvedRatioAmount = (val / this.totalRatio) * this.totalRatioBalance;
    this.balance -= solvedRatioAmount;
    return solvedRatioAmount;
  }

  compute = (req, res) => {
    // Receive parameters from Request payload
    const { ID, Amount, SplitInfo } = req.body;

    // The SplitInfo array can contain a minimum of 1 split entity and a maximum of 20 entities.
    if (!ID || !Amount || !SplitInfo)
      return res.status(400).json({ error: 'ID or Amount or SplitInfo cannot be empty' })


    // set Initial balance
    this.balance = Amount;
    // Storage for response
    let SplitBreakdown = [];

    // Compute Flats
    const flats = SplitInfo.filter((type) => type.SplitType === 'FLAT');
    flats.forEach((value) => {
      const flatAmount = this.splitByFlat(value.SplitValue);
      // Store computed Flats to response storage
      SplitBreakdown.push({
        SplitEntityId: value.SplitEntityId,
        Amount: flatAmount,
      });
    });

    // Compute Percentage
    const percentages = SplitInfo.filter((type) => type.SplitType === 'PERCENTAGE');
    percentages.forEach((value) => {
      const percentageAmount = this.splitByPercentage(value.SplitValue);
      // Store computed Percentages to response storage
      SplitBreakdown.push({
        SplitEntityId: value.SplitEntityId,
        Amount: percentageAmount,
      });
    });

    // Compute Ratio
    const ratios = SplitInfo.filter((type) => type.SplitType === 'RATIO');
    // Sum ratios, get total ratios
    let sumRatios = 0;
    for (const element of ratios) {
      sumRatios += element.SplitValue;
    }
    // Set total ratios
    this.totalRatio = sumRatios;
    // Set current ratios balance
    this.totalRatioBalance = this.balance;
    ratios.forEach((value) => {
      const ratioAmount = this.splitByRatio(value.SplitValue);
      // Store computed Ratios to response storage
      SplitBreakdown.push({
        SplitEntityId: value.SplitEntityId,
        Amount: ratioAmount,
      });
    });

    // Return computed response
    res.status(200).json({
      ID,
      Balance: this.balance,
      SplitBreakdown,
    });
  };
}

module.exports = Compute;
