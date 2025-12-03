const pool = require("../database/");

// Create a new test drive request

async function createRequest(userId, vehicleId, preferredDate, comments) {
    try {
        const sql = `
    INSERT INTO test_drive_requests (user_id, vehicle_id, preferred_date, comments)
    VALUES ($1, $2, $3, $4)
    RETURNING request_id
    `;
        const values = [userId, vehicleId, preferredDate, comments || null];
        const result = await pool.query(sql, values);
        return result.rowCount > 0;
    } catch (error) {
        console.error("Error creating test drive request:", error);
        throw error;
    }
}

// Get all test drive requests for a given user

async function getRequestsByUser(userId) {
    try {
        const sql = `
    SELECT r.request_id, r.preferred_date, r.comments, r.status,
            v.inv_make, v.inv_model, v.inv_year
    FROM test_drive_requests r
    JOIN inventory v ON r.vehicle_id = v.inv_id
    WHERE r.user_id = $1
    ORDER BY r.request_date DESC
    `;
        const values = [userId];
        const result = await pool.query(sql, values);
        return result.rows;
    } catch (error) {
        console.error("Error getting test drive requests:", error);
        throw error;
    }
}

module.exports = {
    createRequest,
    getRequestsByUser,
};