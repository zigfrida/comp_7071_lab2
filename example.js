const fs = require("fs");
const oracledb = require("oracledb");
const profile = "profile.jpg";
import {
    generateCustomers,
    generateEmployees,
    generateServiceType,
    generateCustomerService,
    generateCustomerServiceSchedule,
} from "./generateData";

oracledb.initOracleClient({ libDir: "C:\\oracle\\instantclient_21_6" });

// QUESTION 1
// “Find the id, name, date of birth, photo and the corresponding total ActualDuration of customers who have received service from an employee 'Emp 1'. “
// [4 marks] Create indexes on the columns that you think will speed up the performance of the above query.  Use the Explain Plan command of Oracle (or other means of benchmarking) to demonstrate that the use of indexes improved performance of the above query.
// After you have inserted the data in the database, you can type the Explain Plan For command as shown in the following example:
// Explain Plan For Select * from Employees where Name like 'Emp 1';

async function run() {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "admin",
            password: "P@$$w0rd82hJ01Koj21",
            connectionString: "Y6AQMDWOEPZ559SA_high",
        });

        // Create a table

        await connection.execute(`begin
                                execute immediate 'drop table customer';
                                exception when others then if sqlcode <> -942 then raise; end if;
                              end;`);

        await connection.execute(`begin
                              execute immediate 'drop table employee';
                              exception when others then if sqlcode <> -942 then raise; end if;
                            end;`);

        await connection.execute(
            `create table customer (ID uuid, Name char(20), Street char(20), City char(20), Photo BLOB, Gender char(20), birthdate DATE, PRIMARY KEY(ID));`
        );

        await connection.execute(
            `create table employee (ID uuid, Name char(20), Street char(20), City char(20), Photo BLOB, ManagerID int, JobTitle char(20), Certification char(100), Salary int, PRIMARY KEY(ID));`
        );

        await connection.execute(
            `create table ServiceType (ID uuid, Name char(20), CertificationRqts char(100), Rate int, PRIMARY KEY(ID));`
        );

        await connection.execute(
            `create table CustomerService(CustomerID uuid, ServiceTypeID uuid, ExpectedDuration int, PRIMARY KEY(CustomerID, ServiceTypeID), FOREIGN KEY(CustomerID) REFERENCES Customer(ID), FOREIGN KEY(ServiceTypeID) REFERENCES ServiceType(ID));`
        );

        await connection.execute(
            `create table CustomerServiceSchedule(CustomerID uuid, ServiceTypeID uuid, EmployeeID uuid, StartDateTime date, ActualDuration int, Status char(20), FOREIGN KEY (CustomerID, ServiceTypeID) REFERENCES CustomerService(CustomerID, ServiceTypeID),
            FOREIGN KEY (EmployeeID) REFERENCES Employee(id));`
        );

        // Insert some rows
        const sqlCustomers = `INSERT INTO customer VALUES (:1, :2, :3, :4, :5, :6, :7)`;
        const customerBinds = generateCustomers();
        await connection.executeMany(sqlCustomers, customerBinds);

        const sqlEmployees = `INSERT INTO employee VALUES (:1, :2, :3, :4, :5, :6, :7, :8)`;
        const employeeBinds = generateEmployees();
        await connection.executeMany(sqlEmployees, employeeBinds);

        const sqlServiceTypes = `INSERT INTO serviceType VALUES (:1, :2, :3, :4)`;
        const serviceTypeBinds = generateServiceType();
        await connection.executeMany(sqlServiceTypes, serviceTypeBinds);

        const sqlCustomerService = `INSERT INTO customerservice VALUES (:1, :2, :3)`;
        const customerServiceBinds = generateCustomerService();
        await connection.executeMany(sqlCustomerService, customerServiceBinds);

        const sqlCustomerServiceSchedule = `INSERT INTO customerserviceschedule VALUES (:1, :2, :3, :4, :5, :6)`;
        const customerServiceScheduleBinds = generateCustomerServiceSchedule();
        await connection.executeMany(
            sqlCustomerServiceSchedule,
            customerServiceScheduleBinds
        );

        // connection.commit();     // uncomment to make data persistent

        // Now query the rows back

        const result_1 =
            await connection.execute(`SELECT c.id, c.name, c.birthdate 
                                               FROM customer c
                                               JOIN CustomerServiceSchedule css ON c.id = css.customerID
                                               JOIN employee e ON e.id = css.employeeID
                                               WHERE e.name = 'Emp 1'`);

        const explain = await connection.execute(`EXPLAIN PLAN FOR
                                                  SELECT *
                                                  FROM employee
                                                  WHERE name LIKE 'Emp 1'`);

        console.dir(result_1.rows, { depth: null });

        console.dir(explain.rows, { depth: null });
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

run();

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// QUESTION 2
// [5 marks] Write a Java/JDBC test program to demonstrate the use of transactions and the resulting ACID assurance.
// In addition to demonstrating the code, submit the code in this D2L assignment folder before the end of the lab.

// ANSWER: The use of ASYNC and AWAIT in the function makes sure that when updating
async function testACID() {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "admin",
            password: "P@$$w0rd82hJ01Koj21",
            connectionString: "Y6AQMDWOEPZ559SA_high",
        });

        const result_1 =
            await connection.execute(`SELECT c.id, c.name, c.birthdate 
                                               FROM customer c
                                               JOIN CustomerServiceSchedule css ON c.id = css.customerID
                                               JOIN employee e ON e.id = css.employeeID
                                               WHERE e.name = 'Emp 1'`);

        const explain = await connection.execute(`EXPLAIN PLAN FOR
                                                  SELECT *
                                                  FROM employee
                                                  WHERE name LIKE 'Emp 1'`);

        console.dir(result_1.rows, { depth: null });

        console.dir(explain.rows, { depth: null });
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
