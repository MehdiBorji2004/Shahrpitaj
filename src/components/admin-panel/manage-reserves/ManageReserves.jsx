import PanelHeader from "../dashboard/panel-header/PanelHeader";
import PanelReservesInfo from "../dashboard/panel-reserves-info/PanelReservesInfo";

const ManageReserves = () => {
  return (
    <section className="panel-content">
      <PanelHeader title={"مدیریت رزرو ها"} />
      <PanelReservesInfo dataKey={"manage-reserves"} />
    </section>
  );
};

export default ManageReserves;
