import React from 'react'
import { Card, Button, Badge } from 'react-bootstrap';

function TodoCards({ todo }) {
    return (
        <div>
            <Card className='mb-3 shadow-sm'>
                <Card.Body>
                    <Card.Title>{todo.name}</Card.Title>
                    <Badge
                        pill
                        bg={todo.completed ? "success" : "danger"}
                        className="mb-2"
                    >
                        {todo.completed ? "Complete" : "Incomplete"}
                    </Badge>
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-primary"
                            size="sm"
                        >
                            ✏️ Edit
                        </Button>
                        <Button
                            variant="outline-danger"
                            size="sm"
                        >
                            🗑️ Delete
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default TodoCards