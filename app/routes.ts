import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/party/:code", "routes/party.$code.tsx"),
	route("asie/:round", "routes/asia.$round.tsx"),
	route("europe/:round", "routes/europe.$round.tsx"),
	route("amerique/:round", "routes/america.$round.tsx"),
	route("afrique/:round", "routes/africa.$round.tsx")
] satisfies RouteConfig;
