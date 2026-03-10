import express from "express";
import gateway from "../gateway/gateway.js";

export const communicatorGateway = async(req, res, next) => {
    try {
        const url = req.url.replace(/\//g, "");
        const request = req.body;
        if(url === "getScore") {
            console.dir(req.cookies);
            const getScore = await gateway.getScore(request);
            console.dir(getScore);
            await res.json(getScore);
        } else if (url === "updateScore") {
            const updateScore = await gateway.updateScore(request);
            await res.json(updateScore);
        } else if (url === "patchUpdateScore") {
            const patchUpdateScore = await gateway.patchUpdateScore(request);
            await res.json(patchUpdateScore);
        } else if (url === "createScore") {
            const createScore = await gateway.createScore(request);
            await res.json(createScore);
        }
        else {
            next();
        }
        // const orders = await communicator.getOrders();
        // const users = await communicator.getUsers();
        // const products = await communicator.getProducts();

        // const detailedOrders = orders.orders.map(order => {
        // const user = users.users.find(user => user.id === order.user_id);
        // const product = products.products.find(product => product.id === order.product_id);
        //  return { ...order, user, product };
        // });

        // res.json({ orders: detailedOrders });
    } catch (err) {
        //res.status(500).json({ error: 'Internal Server Error in Communicator Gateway' });
        err["message"] = 'Internal Server Error in Communicator Gateway !!';
        next(err);
    }
};