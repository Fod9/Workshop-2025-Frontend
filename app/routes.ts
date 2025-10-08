import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/party/:code", "routes/party.$code.tsx"),
	route("asia/:round", "routes/asia.$round.tsx"),
	route("afrique/:round", "routes/afrique.$round.tsx"),
] satisfies RouteConfig;
