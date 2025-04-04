import express from "express";
import FinancialRecordModel from "../schema/financial-record";

const router = express.Router();

const getAllByUserID = async (req: express.Request, res: express.Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }
    
    const financialRecords = await FinancialRecordModel.find({ userId }).exec();
    res.json(financialRecords || []);
  } catch (err) {
    console.error("Error fetching records:", err);
    res.status(500).json({ error: "Failed to fetch records", records: [] });
  }
};

router.get("/getAllByUserID/:userId", getAllByUserID);

const updateRecord = async (req: express.Request, res: express.Response) => {
  try {
    const id = req.params.id;
    const newRecordBody = req.body;
    const record = await FinancialRecordModel.findByIdAndUpdate(
      id,
      newRecordBody,
      { new: true }
    );

    if (!record) {
      res.status(404).send();
      return;
    }

    res.status(200).send(record);
  } catch (err) {
    res.status(500).send(err);
  }
};

const deleteRecord = async (req: express.Request, res: express.Response) => {
  try {
    const id = req.params.id;
    const record = await FinancialRecordModel.findByIdAndDelete(id);
    if (!record) {
      res.status(404).send();
      return;
    }
    res.status(200).send(record);
  } catch (err) {
    res.status(500).send(err);
  }
};

const createRecord = async (req: express.Request, res: express.Response) => {
  try {
    const recordData = req.body;
    const newRecord = new FinancialRecordModel(recordData);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    console.error("Error creating record:", err);
    res.status(500).json({ error: "Failed to create record" });
  }
};

router.post("/", createRecord);
router.put("/:id", updateRecord);
router.delete("/:id", deleteRecord);

export default router;