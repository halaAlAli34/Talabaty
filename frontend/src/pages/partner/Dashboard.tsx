import { useEffect, useState } from "react";

import {
  FiShoppingBag,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

import StatCard from "../../components/layout/StatCard";

import {
  getOrders,
} from "../../api/Ordersapi";

import type {
  Order,
} from "../../types/order";



const Dashboard = () => {


  const [orders,setOrders] = useState<Order[]>([]);

  const [loading,setLoading] = useState(true);

  const [error,setError] = useState("");



  useEffect(()=>{

    const fetchOrders = async()=>{

      try{

        setLoading(true);

        const response = await getOrders();

        setOrders(response.data);


      }catch(err){

        console.error(err);

        setError(
          "Failed to load dashboard data"
        );

      }finally{

        setLoading(false);

      }

    };


    fetchOrders();


  },[]);





  const todayOrders =
    orders.length;



  const revenue =
    orders.reduce(
      (total,order)=>
        total + order.totalAmount,
      0
    );



  const pending =
    orders.filter(
      order =>
      order.orderStatus === "pending"
    ).length;



  const completed =
    orders.filter(
      order =>
      order.orderStatus === "delivered"
    ).length;





  const recentOrders =
    [...orders]
    .sort(
      (a,b)=>
      new Date(b.createdAt).getTime()
      -
      new Date(a.createdAt).getTime()
    )
    .slice(0,5);







  const getStatusClass = (
    status:string
  )=>{

    switch(status){

      case "delivered":
        return "status-badge completed";


      case "pending":
        return "status-badge pending";


      case "preparing":
        return "status-badge preparing";


      default:
        return "status-badge";

    }

  };






  return (

    <div className="dashboard-page">



      <div className="dashboard-welcome">

        <h2>
          Welcome back 👋
        </h2>

        <p>
          Here’s what’s happening with your restaurant today
        </p>

      </div>






      {loading && (

        <div className="modern-card p-4">

          Loading dashboard...

        </div>

      )}






      {error && (

        <div className="modern-card p-4 text-danger">

          {error}

        </div>

      )}






      {!loading && !error && (


      <>



      {/* STATS */}

      <div className="row g-4 mt-2">


        <div className="col-lg-3 col-md-6">

          <StatCard

            title="Total Orders"

            value={todayOrders}

            subtitle="All customer orders"

            icon={FiShoppingBag}

            bgColor="#2F80ED"

          />

        </div>





        <div className="col-lg-3 col-md-6">

          <StatCard

            title="Revenue"

            value={`$${revenue.toFixed(2)}`}

            subtitle="Total earnings"

            icon={FiDollarSign}

            bgColor="#27AE60"

          />

        </div>





        <div className="col-lg-3 col-md-6">

          <StatCard

            title="Pending"

            value={pending}

            subtitle="Waiting orders"

            icon={FiClock}

            bgColor="#F2994A"

          />

        </div>





        <div className="col-lg-3 col-md-6">

          <StatCard

            title="Completed"

            value={completed}

            subtitle="Delivered orders"

            icon={FiCheckCircle}

            bgColor="#6FCF97"

          />

        </div>



      </div>









      {/* RECENT ORDERS */}


      <div className="modern-card mt-5">


        <div className="card-header-modern">

          <h5>
            Recent Orders
          </h5>


          <span>
            Live data
          </span>


        </div>





        <div className="table-responsive">


        <table className="modern-table">


        <thead>

          <tr>

            <th>
              Order
            </th>

            <th>
              Customer
            </th>

            <th>
              Total
            </th>

            <th>
              Payment
            </th>

            <th>
              Status
            </th>

          </tr>


        </thead>





        <tbody>


        {recentOrders.map(
          (order)=>(


          <tr key={order._id}>


            <td>

              #
              {
                order._id
                .slice(-6)
                .toUpperCase()
              }

            </td>




            <td>

              Customer

            </td>




            <td>

              $
              {
                order.totalAmount
              }

            </td>





            <td>

              {
                order.paymentMethod
              }

            </td>





            <td>

              <span
                className={
                  getStatusClass(
                    order.orderStatus
                  )
                }
              >

                {
                  order.orderStatus
                }

              </span>


            </td>



          </tr>


        ))}


        </tbody>


        </table>


        </div>



      </div>



      </>

      )}



    </div>

  );

};


export default Dashboard;