import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/party/:code", "routes/party.$code.tsx"),
] satisfies RouteConfig;
