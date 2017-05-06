package main

func (C *Controller) handleInit(msg InboundMessage) {
	// Initialize newly connected user
	p := Agent{
		Type:     "player",
		Pos:      Point{X: 256, Y: 256}, // Default spawn location is 10, 10 for now. We can change this later -- David
		ID:       msg.Sender,
		SpriteID: "F",
		Dir:      "down",
	}
	C.World.Agents[msg.Sender] = p
	init := Data{
		Message: "alrighty, here you go",
		Init:    Init{C.World},
	}

	C.sendMessage("init", init, msg.Sender)

	// Update all other players
	u := Update{
		Add: []Agent{p},
	}
	update := Data{
		Message: "let's keep everyone on the same page",
		Update:  u,
	}
	C.broadcastMessage("add", update, msg.Sender)
}

func (C *Controller) handleUpdate(msg InboundMessage) {
	// TODO: Apply state validation, more granular changes, copy by reference (maybe?)
	// Apply update to server state
	for _, p := range msg.Data.Update.Delta {
		C.World.Agents[p.ID] = p
	}

	// Forward update to all players
	d := Data{
		Message: "catch up plz",
		Update:  msg.Data.Update,
	}
	C.broadcastMessage("update", d, msg.Sender)
}

func (C *Controller) handleDisconnect(id int32) {
	// Remove the player from our server state and client from connections
	removedPlayer := C.World.Agents[id]
	delete(C.World.Agents, id)
	delete(C.Clients, id)

	// Update all other players
	u := Update{
		Delete: []Agent{removedPlayer},
	}
	d := Data{
		Message: "catch up plz",
		Update:  u,
	}
	C.broadcastMessage("delete", d, -1)
}
