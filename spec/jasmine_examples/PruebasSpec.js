const { request } = require("express");
const { response } = require("express");
const usePost = require("request");
const mysql = require("mysql");
const config = require("../../helpers/config.js");
const connection = mysql.createConnection(config, { multipleStatements: true });

let usuario = Math.floor(Math.random() * 201);
let rand = Math.floor(Math.random() * 5);
let usuarioMal = ["#", "%", "&", "<", ">"];

var base_url = [
  "http://localhost:9000/mappers/overview?maps=ipmaps&order=asc",
  "http://localhost:9000/mappers/details/101",
  "http://localhost:9000/mappers/contributions/3",
  "http://localhost:9000/mappers/countries",
];

//PRUEBAS FUNCIONALES
describe("PRUEBAS FUNCIONALES", function () {
  describe("Mappers Overview ", () => {
    describe("GET /", function () {
      it("returns status code 200", function () {
        request.get(base_url[0], function (error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
        });
      });
    });
  });

  describe("Mapper details ", () => {
    describe("GET /", () => {
      it("returns status code 200", function () {
        request.get(base_url[1], function (error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
        });
      });
    });
  });

  describe("Mapper contributions ", function () {
    describe("GET /", function () {
      it("returns status code 200", function () {
        request.get(base_url[2], function (error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
        });
      });
    });
  });

  describe("Mapper contributions ", function () {
    describe("GET /", function () {
      it("returns status code 200", function () {
        request.get(
          `http://localhost:9000/mappers/contributions/${usuario}`,
          function (error, response, body) {
            expect(response.statusCode).toBe(200);
            done();
          }
        );
      });
    });
  });

  describe("Mapper contributions ", function () {
    describe("GET /", function () {
      it("returns status code 400", function () {
        request.get(
          `http://localhost:9000/mappers/contributions/${usuarioMal[rand]}`,
          function (error, response, body) {
            expect(response.statusCode).toBe(400);
            done();
          }
        );
      });
    });
  });

  describe("Countries where WTW has presence", function () {
    describe("GET /", function () {
      it("returns status code 200", function () {
        request.get(base_url[3], function (error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
        });
      });
    });
  });

  describe("Random Mapper details", function () {
    describe("GET /", function () {
      it("returns status code 200", function () {
        request.get(
          `http://localhost:9000/mappers/details/${usuario}`,
          function (error, response, body) {
            expect(response.statusCode).toBe(200);
            done();
          }
        );
      });
    });
  });

  describe("Random Mapper details insertando id's no validos", function () {
    describe("GET /", function () {
      it("returns status code 404", function () {
        request.get(
          `http://localhost:9000/mappers/details/${usuarioMal[rand]}`,
          function (error, response, body) {
            expect(error.statusCode).toBe(400); //bad request
            done();
          }
        );
      });
    });
  });

  describe("Random Mapper details insertando id's no validos", function () {
    describe("GET /", function () {
      it("returns status code 404", function () {
        request.get(
          `http://localhost:9000/mappers/details/rewrwrwrw2`,
          function (error, response, body) {
            expect(error.statusCode).toBe(400); //bad request
            done();
          }
        );
      });
    });
  });

  describe("Try to post to get countries selected in a filter", () => {
    describe("POST/", () => {
      it("Debe de fallar si no se le pasa ningun body", function (done) {
        usePost.post(
          base_url[2],
          { json: true, body: {} },
          function (error, response) {
            expect(response.statusCode).toEqual(500);
            done();
          }
        );
      });
    });
  });

  describe("Try to post to get countries selected in a filter", () => {
    describe("POST/", () => {
      it("No debe de fallar si existe un body", function (done) {
        usePost.post(
          base_url[2],
          { json: true, body: { countries: [], cities: [], filter: "" } },
          function (error, response) {
            expect(response.statusCode).toEqual(200);
            done();
          }
        );
      });
    });
  });

  describe("Try to post to get countries selected in a filter", () => {
    describe("POST/", () => {
      it("No deberia mostrar informacion", function (done) {
        usePost.post(
          base_url[2],
          {
            json: true,
            body: { countries: ["4u32oi"], cities: ["dsf"], filter: "fdf" },
          },
          function (error, response) {
            expect(response.statusCode).toEqual(404);
            done();
          }
        );
      });
    });
  });
});
