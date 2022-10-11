const fs = require("fs");
const crypto = require("crypto");
const blobUtil = require("blob-util");

var imageData = fs.readFileSync("./profile.jpg");
var test = imageData;
console.log(test);
//console.log(typeof imageData);

// var blob = blobUtil.arrayBufferToBlob(imageData);
// console.log(blob);

// blobUtil
//     .imgSrcToBlob("https://www.w3schools.com/howto/img_avatar.png")
//     .then(function (blob) {
//         console.log("We have a blob");
//         let blobURL = blobUtil.createObjectURL(blob);
//         console.log(blobURL);
//     })
//     .catch(function (err) {
//         console.log("Image failed to load");
//         console.log(err);
//     });

let customers = [];
let employees = [];
let serviceTypes = [];
let customerServices = [];
let customerServiceSchedules = [];

const randomBirthDate = () => {
    let startDate = new Date(1940, 0, 1);
    let endDate = new Date(1990, 0, 1);
    return new Date(
        startDate.getTime() +
            Math.random() * (endDate.getTime() - startDate.getTime())
    );
};

const generateCustomers = () => {
    for (let i = 1; i <= 3; i++) {
        // uuid, name, street, city, photo, gender
        const uuid = crypto.randomBytes(8).toString("hex");
        let customer = [
            uuid,
            "Cust " + i,
            i + " Street Ave",
            "Burnaby",
            imageData,
            "F",
            randomBirthDate(),
        ];
        customers.push(customer);
    }
    console.log(customers);
};

const generateEmployees = () => {
    for (let i = 1; i <= 15; i++) {
        // uuid, name, street, city, photo, gender
        const uuid = crypto.randomBytes(8).toString("hex");
        let employee = [
            uuid,
            "Emp " + i,
            i + " Street Ave",
            "Burnaby",
            "",
            1,
            "Nurse",
            "SLF",
            10000,
        ];
        employees.push(employee);
    }
    console.log(employees);
};

const generateServiceType = () => {
    let uuid = crypto.randomBytes(8).toString("hex");
    let service1 = [uuid, "Cleaning", "SLF", 70];
    serviceTypes.push(service1);

    uuid = crypto.randomBytes(8).toString("hex");
    service1 = [uuid, "Cooking", "Chef", 95];
    serviceTypes.push(service1);

    uuid = crypto.randomBytes(8).toString("hex");
    service1 = [uuid, "Doctor", "Doctor", 60];
    serviceTypes.push(service1);

    //console.log(serviceTypes);
};

const generateCustomerService = () => {
    for (let i = 0; i <= 100; i++) {
        var customer = customers[Math.floor(Math.random() * customers.length)];
        var service =
            serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
        var customerService = [customer[0], service[0], 45];
        customerServices.push(customerService);
    }
    console.log(customerServices);
};

const randomDate = () => {
    let startDate = new Date(2022, 0, 1);
    let endDate = new Date();
    return new Date(
        startDate.getTime() +
            Math.random() * (endDate.getTime() - startDate.getTime())
    );
};

const generateCustomerServiceSchedule = () => {
    for (let i = 0; i < customerServices.length; i + 2) {
        let employee = employees[Math.floor(Math.random() * employees.length)];
        let custService = customerServices[i];
        let date = randomDate();

        let customerServiceSchedule = [
            custService[0],
            custService[1],
            employee[0],
            date,
            30,
            "Completed",
        ];

        customerServiceSchedules.push(customerServiceSchedule);
    }
};

// generateCustomers();
// generateEmployees();
// generateServiceType();
// generateCustomerService();
// generateCustomerServiceSchedule();

//console.log(randomBirthDate());
