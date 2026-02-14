const { json } = require('stream/consumers');
// const allExpense = getAllExpances();
const fs = require('fs');
const log = console.log;
const FILE_PATH = './expance.json';
// console.log(new Date().getMonth() + 1);


function addExpance(description, amount) {
    try {
        if (!description) {
            return {
                success: false,
                msg: 'Description cannot be Empty'
            }
        }
        if (amount < 0 || amount === undefined) {
            return {
                success: false,
                msg: 'Amount cannot be Negative or Empty'
            }
        }
        const data = getAllExpances();
        const allExpense = data.list;

        const id = allExpense.length > 0 ? allExpense[allExpense.length - 1].Id + 1 : 1;
        const createdAt = new Date();
        allExpense.push({ Id: id, Date: createdAt, description: description, amount: amount, month: createdAt.getMonth() + 1 })
        fs.writeFileSync(FILE_PATH, JSON.stringify(allExpense, null, 2))
        return {
            success: true,
            msg: 'Expance Added Successfuly'
        }

    } catch (error) {
        return {
            success: false,
            msg: error || 'Cannot add new Expance'
        }
    }
}

function getAllExpances() {

    try {
        if (!fs.existsSync(FILE_PATH)) {
            return { success: false,  msg:'file not Found', list: [], summarry: 0 }
        }
        const data = fs.readFileSync(FILE_PATH, 'utf-8');
        if (!data) return { success: false, msg:'No data Found', list: [], summarry: 0 }
        const allExpansses = JSON.parse(data);
        const summarry = allExpansses.reduce((sum, curr) => sum + curr.amount, 0)
        return {
            success: true,
            list: allExpansses,
            summarry: summarry
        }

    } catch (error) {
        return { success: false, list: [], summarry: 0 };
    }

}

function updateExpance(id, desc, amt) {
    try {
        id = Number(id);
        amt = Number(amt)
        const data = getAllExpances();
        const allExpanse = data.list;
        const expanse = allExpanse.find(e => e.Id === id);
        if (!expanse) {
            return {
                success: false,
                msg: 'Invalid Expanse Id'
            }
        }
        if (desc !== undefined) expanse.description = desc;
        if (amt !== undefined && !isNaN(amt) && amt >= 0) {
            expanse.amount = amt;
        }
        fs.writeFileSync(FILE_PATH, JSON.stringify(allExpanse, null, 2));
        return {
            success: true,
            msg: 'Expanse updated Successfully'
        }
    } catch (error) {
        return {
            success: false,
            msg: error || 'Cannot update the Expanse'
        }
    }
}

function deleteExpance(id) {
    try {
        id = Number(id);
        const data = getAllExpances();
        const allExpase = data.list;

        const remainingExpanses = allExpase.filter(t => t.Id !== id);
        fs.writeFileSync(FILE_PATH, JSON.stringify(remainingExpanses, null, 2));
        return {
            success: true,
            msg: 'Expanse deleted successfully'
        }
    } catch (error) {
        return {
            success: false,
            msg: error || 'Cannot Delete the Expanse'
        }
    }
}

function getExpanceByMonth(month) {
    try {
        month = Number(month)
        const data = getAllExpances();
        const allExpanse = data.list;

        const monthExpanse = allExpanse.filter(e => e.month === month);
        const sum = monthExpanse.reduce((acc, e) => acc + e.amount, 0);

        return {
            success: true,
            MonthlyExpanse: sum
        }
    } catch (error) {
        return {
            success: false,
            msg: error || 'Cannot get expanses by month'
        }
    }
}

module.exports = {
    addExpance,
    getAllExpances,
    updateExpance,
    deleteExpance,
    getExpanceByMonth
}