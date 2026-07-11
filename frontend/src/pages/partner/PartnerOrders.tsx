import { useEffect, useState } from "react";
import {
  FiSearch,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";

import {
  getOrders,
  updateOrderStatus,
} from "../../api/Ordersapi";

import type {
  Order,
  OrderStatus,
} from "../../types/order";


const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  preparing: "Preparing",
  delivered: "Delivered",
  cancelled: "Cancelled",
};


const STATUS_CLASSES: Record<OrderStatus, string> = {
  pending: "status-pending",
  preparing: "status-preparing",
  delivered: "status-delivered",
  cancelled: "status-cancelled",
};


const Orders = () => {

  const [orders, setOrders] = useState<Order[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [pendingActionId, setPendingActionId] =
    useState<string | null>(null);



  const fetchOrders = async () => {

    try {

      setLoading(true);
      setError(null);


      const response = await getOrders();


      setOrders(response.data);


    } catch (err) {

      console.error(err);

      setError(
        "Failed to load orders."
      );

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    fetchOrders();

  }, []);




  const changeStatus = async (
    orderId: string,
    status: OrderStatus
  ) => {


    try {

      setPendingActionId(orderId);


      const updated =
        await updateOrderStatus(
          orderId,
          status
        );


      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? updated
            : order
        )
      );


    } catch (error) {

      console.error(error);

      setError(
        "Failed to update order."
      );


    } finally {

      setPendingActionId(null);

    }

  };




  const filteredOrders =
    orders.filter((order) =>
      order._id
        .toLowerCase()
        .includes(search.toLowerCase())
    );





  const formatDate = (
    date: string
  ) => {

    return new Date(date)
      .toLocaleString();

  };





  return (

    <div className="orders-page">


      <div className="page-header">

        <h2>
          Orders
        </h2>

        <p>
          View customer orders
        </p>

      </div>





      <div className="orders-stats">


        <div className="stat">

          <FiPackage />

          <div>

            <h3>
              {orders.length}
            </h3>

            <p>
              Total Orders
            </p>

          </div>

        </div>




        <div className="stat">

          <FiClock />

          <div>

            <h3>
              {
                orders.filter(
                  o =>
                  o.orderStatus === "pending"
                ).length
              }
            </h3>

            <p>
              Pending
            </p>

          </div>

        </div>




        <div className="stat">

          <FiPackage />

          <div>

            <h3>
              {
                orders.filter(
                  o =>
                  o.orderStatus === "preparing"
                ).length
              }
            </h3>

            <p>
              Preparing
            </p>

          </div>

        </div>





        <div className="stat">

          <FiCheckCircle />

          <div>

            <h3>
              {
                orders.filter(
                  o =>
                  o.orderStatus === "delivered"
                ).length
              }
            </h3>

            <p>
              Delivered
            </p>

          </div>

        </div>


      </div>





      <div className="orders-filters">


        <div className="search-box">

          <FiSearch />

          <input

            placeholder="Search order id..."

            value={search}

            onChange={(e)=>
              setSearch(e.target.value)
            }

          />

        </div>


      </div>





      {error && (

        <div className="orders-error">

          <FiAlertTriangle />

          <span>
            {error}
          </span>


          <button
            onClick={fetchOrders}
          >
            Retry
          </button>


        </div>

      )}







      {loading ? (

        <div className="orders-loading">

          Loading orders...

        </div>


      ) : filteredOrders.length === 0 ? (

        <div className="orders-empty">

          No orders found.

        </div>


      ) : (


        <div className="orders-list">


          {
            filteredOrders.map(
              (order)=>{


                const busy =
                  pendingActionId === order._id;



                return (

                  <div
                    className="order-card"
                    key={order._id}
                  >


                    <div className="order-top">


                      <h4>
                        #
                        {
                          order._id
                            .slice(-6)
                            .toUpperCase()
                        }
                      </h4>



                      <span
                        className={
                          STATUS_CLASSES[
                            order.orderStatus
                          ]
                        }
                      >

                        {
                          STATUS_LABELS[
                            order.orderStatus
                          ]
                        }

                      </span>


                    </div>





                    <div className="order-body">


                      <p>
                        <b>
                          Customer ID:
                        </b>

                        {" "}
                        {
                          order.customerId
                        }

                      </p>




                      <p>

                        <b>
                          Items:
                        </b>


                        {
                          order.items
                            .map(
                              item =>
                              `${item.title} x${item.quantity}`
                            )
                            .join(", ")
                        }

                      </p>




                      <p>

                        <b>
                          Total:
                        </b>

                        $
                        {
                          order.totalAmount
                        }

                      </p>




                      <p>

                        <b>
                          Date:
                        </b>

                        {
                          formatDate(
                            order.createdAt
                          )
                        }

                      </p>



                    </div>





                    <div className="order-actions">


                      {
                        order.orderStatus === "pending" && (

                          <button

                            disabled={busy}

                            className="update"

                            onClick={() =>
                              changeStatus(
                                order._id,
                                "preparing"
                              )
                            }

                          >

                            Accept

                          </button>

                        )
                      }





                      {
                        order.orderStatus === "preparing" && (

                          <button

                            disabled={busy}

                            className="view"

                            onClick={() =>
                              changeStatus(
                                order._id,
                                "delivered"
                              )
                            }

                          >

                            Mark Delivered

                          </button>


                        )
                      }





                    </div>



                  </div>


                );

              }

            )
          }


        </div>


      )}


    </div>

  );

};


export default Orders;