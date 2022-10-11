const fs = require("fs");
const oracledb = require("oracledb");
const profile = "profile.jpg";

oracledb.initOracleClient({ libDir: "C:\\oracle\\instantclient_21_6" });

async function run() {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "admin",
            password: "P@$$w0rd882gol",
            connectionString: "Y6AQMDWOEPZ559SA_high",
        });

        // Create a table

        // await connection.execute(`begin
        //                         execute immediate 'drop table customer';
        //                         exception when others then if sqlcode <> -942 then raise; end if;
        //                       end;`);

        // await connection.execute(`begin
        //                       execute immediate 'drop table employee';
        //                       exception when others then if sqlcode <> -942 then raise; end if;
        //                     end;`);

        await connection.execute(
            `create table customer (ID uuid, Name char(20), Street char(20), City char(20), Photo BLOB, Gender char(20), birthdate DATE, PRIMARY KEY(ID));`
        );

        // await connection.execute(
        //     `create table employee (ID uuid, Name char(20), Street char(20), City char(20), Photo BLOB, ManagerID int, JobTitle char(20), Certification char(100), Salary int, PRIMARY KEY(ID));`
        // );

        // await connection.execute(
        //     `create table ServiceType (ID uuid, Name char(20), CertificationRqts char(100), Rate int, PRIMARY KEY(ID));`
        // );

        // await connection.execute(
        //     `create table CustomerService(CustomerID uuid, ServiceTypeID uuid, ExpectedDuration int, PRIMARY KEY(CustomerID, ServiceTypeID), FOREIGN KEY(CustomerID) REFERENCES Customer(ID), FOREIGN KEY(ServiceTypeID) REFERENCES ServiceType(ID));`
        // );

        // await connection.execute(
        //     `create table CustomerServiceSchedule(CustomerID uuid, ServiceTypeID uuid, EmployeeID uuid, StartDateTime date, ActualDuration int, Status char(20), FOREIGN KEY (CustomerID, ServiceTypeID) REFERENCES CustomerService(CustomerID, ServiceTypeID),
        //     FOREIGN KEY (EmployeeID) REFERENCES Employee(id));`
        // );

        //const data =

        // Insert some rows

        const sqlCustomers = `INSERT INTO customer VALUES (:1, :2, :3, :4, :5, :6, :7)`;
        const customerBinds = [];

        const sql = `INSERT INTO nodetab VALUES (:1, :2)`;

        const binds = [
            [1, "First"],
            [2, "Second"],
            [3, "Third"],
            [4, "Fourth"],
            [5, "Fifth"],
            [6, "Sixth"],
            [7, "Seventh"],
        ];

        await connection.executeMany(sql, binds);

        //

        // connection.commit();     // uncomment to make data persistent

        // Now query the rows back

        const result = await connection.execute(`SELECT * FROM nodetab`);

        const test = await connection.execute(`SELECT c.id, c.name, c.birthdate 
                                               FROM customer c
                                               JOIN CustomerServiceSchedule css ON c.id = css.customerID
                                               JOIN employee e ON e.id = css.employeeID
                                               WHERE e.name = 'Emp 1'`);

        const explain = await connection.execute(`EXPLAIN PLAN FOR
                                                  SELECT *
                                                  FROM employee
                                                  WHERE name LIKE 'Emp 1'`);

        //console.dir(result.rows, { depth: null });
        console.dir(test.rows, { depth: null });
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
