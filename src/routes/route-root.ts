import RouteAccount from "z@Routes/accounts/route-account";
import RouteAuth from "z@Routes/auths/route-auth";
import RouteMoment from "z@Routes/moments/route-moment";
import RouteReply from "z@Routes/replies/route-reply";
import RouteUpload from "z@Routes/uploads/route-upload";

const AllRoutes = [
  new RouteAuth(),
  new RouteAccount(),
  new RouteUpload(),
  new RouteMoment(),
  new RouteReply(),
];

export default AllRoutes;
