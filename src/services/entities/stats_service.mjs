import { getDateTime } from '../../utils/datetime.mjs';
import periodModel from '../../models/entities/period_model.mjs';
import tesisModel from '../../models/entities/tesis_model.mjs';
import studentsModel from '../../models/users/student_model.mjs';
import teachersModel from '../../models/users/teacher_model.mjs';
import AppError from '../../utils/errors/server_errors.mjs';

import mongoose from 'mongoose';


export const statsSystem = async() => {
    try {
        const studentCount = await studentsModel.countDocuments();
        const teacherCount = await teachersModel.countDocuments();
        const periodCount = await periodModel.countDocuments();
        const tesisCount = await tesisModel.countDocuments();

        const stats = {
            studentCount,
            teacherCount,
            periodCount,
            tesisCount
        };

        return stats;
    } catch (error) {
        throw error;
    }
}