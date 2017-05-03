package main

import (
	"log"
	"math/rand"

	"github.com/gorilla/websocket"
)

// Controller handles all ws connection events and is the driver module
type Controller struct {
	ReceiveChan chan InboundMessage
	SendChan    chan OutboundMessage
	Clients     map[int32]*Client
	World       World
}

// NewController creates a new controller
func NewController() Controller {
	w := World{
		Size:   512,
		Seed:   0,
		Agents: map[int32]Agent{},
	}
	c := Controller{
		ReceiveChan: make(chan InboundMessage, 128),
		SendChan:    make(chan OutboundMessage, 128),
		Clients:     make(map[int32]*Client),
		World:       w,
	}
	return c
}

func (C *Controller) run() {
	go C.handleInboundMessages()
	go C.handleOutboundMessages()
}

func (C *Controller) handleInboundMessages() {
	for {
		msg := <-C.ReceiveChan
		switch msg.Type {
		case "init":
			C.handleInit(msg)
		case "update":
			C.handleUpdate(msg)
		default:
			log.Printf("message unhandled: %+v\n", msg)
		}
	}
}

func (C *Controller) sendMessage(t string, data Data, id int32) {
	send := OutboundMessage{
		Type:     t,
		Data:     data,
		Receiver: id,
	}
	C.SendChan <- send
}

func (C *Controller) broadcastMessage(t string, data Data, sender int32) {
	for id := range C.Clients {
		if id == sender {
			continue
		}
		C.sendMessage(t, data, id)
	}
}

func (C *Controller) handleOutboundMessages() {
	for {
		msg := <-C.SendChan
		client, ok := C.Clients[msg.Receiver]
		if !ok {
			log.Printf("error: could not find connection by id\n")
			continue
		}
		client.WriteJSON(msg)
	}
}

// AddConn adds connections to be tracked and listened to
func (C *Controller) AddConn(conn *websocket.Conn) {
	id := C.nextID()
	client := NewClient(conn, id)
	C.Clients[id] = client
	go C.readFromClient(client)
}

func (C *Controller) readFromClient(client *Client) {
	for {
		var msg InboundMessage
		err := client.ReadJSON(&msg)
		if err != nil {
			log.Printf("Connection closed by %d\n", client.ID)
			C.handleDisconnect(client.ID)
			return
		}
		// TODO: this is sort of hacky IMO? should refactor in future
		// Fill in the ID as part of the incoming message
		msg.Sender = client.ID
		C.ReceiveChan <- msg
	}
}

func (C *Controller) nextID() int32 {
	// TODO: do something else here that doesn't put your 4 years of higher education to fucking shame
	for {
		id := rand.Int31()
		if _, ok := C.Clients[id]; !ok {
			return id
		}
	}
}
