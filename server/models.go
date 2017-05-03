package main

// InboundMessage is used to unmarshal incoming events
type InboundMessage struct {
	Type   string `json:"type"`
	Data   Data   `json:"data"`
	Sender int32  `json:"id"`
}

// OutboundMessage is used to marshal outgoing events
type OutboundMessage struct {
	Type     string `json:"type"`
	Data     Data   `json:"data"`
	Receiver int32  `json:"id"`
}

// Data stores the primary payload of each message
type Data struct {
	Message string `json:"message"`
	Init    Init   `json:"init"`
	Update  Update `json:"update"`
}

// Init encapsulates data to initialize game state for new connections
type Init struct {
	World World `json:"world"`
}

// World encapsulates data for the world state
type World struct {
	Agents map[int32]Agent `json:"agents"`
	Size   int32           `json:"size"`
	Seed   int32           `json:"seed"`
}

// Agent encapsulates data for users
type Agent struct {
	Type     string `json:"type"`
	Pos      Point  `json:"pos"`
	ID       int32  `json:"id"`
	SpriteID string `json:"spriteID"`
	Dir      string `json:"dir"`
}

// Point is a cartesian tuple
type Point struct {
	X int32 `json:"x"`
	Y int32 `json:"y"`
}

// Update encapsulates all state differences between t_i and t_{i+1}
type Update struct {
	Add    []Agent `json:"add"`
	Delta  []Agent `json:"delta"`
	Delete []Agent `json:"delete"`
}
