import Expense from "../models/Expense.js"

// CREATE EXPENSE
export const addExpense = async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      user: req.user.id
    })

    res.status(201).json(expense)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET USER EXPENSES
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 })
    res.json(expenses)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// UPDATE EXPENSE
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" })
    }

    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE EXPENSE
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" })
    }

    await expense.deleteOne()
    res.json({ message: "Expense removed" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
