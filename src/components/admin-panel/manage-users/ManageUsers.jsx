import PanelNewUsersInfo from "../dashboard/panel-newUsers-info/PanelNewUsersInfo";

const ManageUsers = () => {
  return (
    <section className="panel-content">
      <h3> مدیریت کاربران </h3>
      <PanelNewUsersInfo dataKey={"manage-users"} showStats={true} />
    </section>
  );
};

export default ManageUsers;
