import winston from "winston";

// Destructure from the default export to safely get methods
const { format, transports, createLogger } = winston;

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
};

const colors = {
	error: "red",
	warn: "yellow",
	info: "green",
	http: "magenta",
	debug: "white",
};

winston.addColors(colors);

const logFormat = format.combine(
	format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
	format.colorize({ all: true }),
	format.printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`)
);

const logTransports = [
	new transports.Console(),

	new transports.File({
		filename: "logs/error.log",
		level: "error",
		format: format.uncolorize(),
	}),

	new transports.File({
		filename: "logs/all.log",
		format: format.uncolorize(),
	}),
];

const logger = createLogger({
	level: process.env.NODE_ENV === "development" ? "debug" : "warn",
	levels,
	format: logFormat,
	transports: logTransports,
});

export default logger;
