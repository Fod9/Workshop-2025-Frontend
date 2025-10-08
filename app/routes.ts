import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/party/:code", "routes/party.$code.tsx"),
	route("asia/:round", "routes/asia.$round.tsx"),
	route("europe/:round", "routes/europe.$round.tsx"),
	route("america/:round", "routes/america.$round.tsx"),
	route("africa/:round", "routes/africa.$round.tsx")
] satisfies RouteConfig;
