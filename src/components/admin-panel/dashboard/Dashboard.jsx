import UseAdminData from "../../../hooks/UseAdminData";
import AlertMessage from "../../alert-messages/AlertMessage";
import PanelHeader from "../dashboard/panel-header/PanelHeader";
import PanelStats from "../dashboard/panel-stats/PanelStats";
import PanelReservesInfo from "../dashboard/panel-reserves-info/PanelReservesInfo";
import PanelNewUsersInfo from "../dashboard/panel-newUsers-info/PanelNewUsersInfo";

const Dashboard = () => {
  const { errors } = UseAdminData();

  return (
    <section className="panel-content">
      {errors && <AlertMessage type={"error"} message={errors} />}
      <PanelHeader title={"داشبورد"} />
      <PanelStats />
      <PanelReservesInfo dataKey={"dashboard"} />
      <PanelNewUsersInfo showStats={false} />
    </section>
  );
};

export default Dashboard;
