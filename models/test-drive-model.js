const pool = require("../database/");

// Create a new test drive request

async function createRequest(account_id, inv_id, requested_date, comment) {
    try {
        const sql = `
    INSERT INTO public.test_drive (account_id, inv_id, requested_date, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING test_drive_id
    `;
        const values = [account_id, inv_id, requested_date, comment];
        const result = await pool.query(sql, values);
        return result.rowCount > 0;
    } catch (error) {
        console.error("Error creating test drive request:", error);
        throw error;
    }
}

// Get all test drive requests for a given user
async function getRequestsByUser(account_id) {
    try {
        const sql = `
        SELECT
          td.test_drive_id,
          td.requested_date,
          td.comment,
          v.inv_make,
          v.inv_model,
          v.inv_year,
          v.inv_thumbnail
        FROM
          public.test_drive td
        JOIN
          public.inventory v ON td.inv_id = v.inv_id
        WHERE
          td.account_id = $1
        ORDER BY
          td.requested_date DESC
        `;
        const values = [account_id];
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