const {program} = require('commander');
const {default:chalk} = require('chalk');
const { addExpance, updateExpance, deleteExpance, getAllExpances, getExpanceByMonth } = require('./expanse');
const log = console.log;

//------------------------------------- Add Expanse -----------------------------------------
program
.command('add')
.option('-d,--description <description>','description of Expanse')
.option('-a,--amount <amount>','amount of expanse')
.action((options)=>{
    const result = addExpance(options.description,Number(options.amount));
    log(result.success ? chalk.green(result.msg) : chalk.red(result.msg))
});

//------------------------------------- Upadete Expanse -----------------------------------------

program.command('update <id>')
.option('-d,--udescription <udescription>','upadte description')
.option('-a, --uamount <uamount>','Update Amount')
.action((id,options) =>{
    const result = updateExpance(Number(id),options.udescription,Number(options.uamount))
    log(result.success ? chalk.green(result.msg) : chalk.red(result.msg))
})

program.command('delete <id>')
.action((id) =>{
    const result = deleteExpance(Number(id))
    log(result.success ? chalk.green(result.list) : chalk.red(result.summary))
})

program.command('list')
.action(() =>{
    log(chalk.green('--------------------------- ') + chalk.blue(' LIST OF ALL EXPANSES') + chalk.green ('-------------------------------------------') + chalk.red('!'));
    const result = getAllExpances();
    if(result.success){
        result.list.forEach(e => {  
            log(chalk.yellow(`Id: ${e.Id} | Date: ${new Date(e.Date).toLocaleDateString()} | Description: ${e.description} | Amount: ${e.amount}`))
        });
        log(chalk.green(`Total Expanse: ${result.summarry} `));
    } else {
        log(chalk.red(result.msg))
    }
    console.log(chalk.green('--------------------------- ') + chalk.blue(' ENG OF LIST') + chalk.green (' -------------------------------------------') + chalk.green('!'));
});


program
.command('summary')
.action(()=>{
    const result = getAllExpances();
    result.success ? log(chalk.green(`Total Expanse: ${result.summarry} `)) : log(chalk.red(result.msg))
})


program
.command('msummary')
.option('-m, --month <month>', 'Get summary of a month')
.action((options)=>{
    const month = Number(options.month);
    if(isNaN(month) || month < 1 || month > 12){
        log(chalk.red('Please provide a valid month number (1-12)'));
        return;
    }
    const result = getExpanceByMonth(month);
    result.success ? log(chalk.green(`Total Expanse for month ${month}: ${result.MonthlyExpanse} `)) : log(chalk.red(result.msg))
});


program.parse(process.argv);