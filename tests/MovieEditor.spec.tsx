import type { Movie } from "../src/interfaces/movie";
import { MovieEditor } from "../src/components/MovieEditor";
import { render, screen, fireEvent } from "@testing-library/react";

const mockMovie: Movie = {
    id: "test-id",
    title: "Spirited Away",
    rating: 5,
    description: "A great movie",
    released: 2001,
    soundtrack: [],
    watched: {
        seen: false,
        liked: false,
        when: null,
    },
};

function renderMovieEditor(
    changeEditing = jest.fn(),
    movie: Movie,
    editMovie = jest.fn(),
    deleteMovie = jest.fn(),
) {
    render(
        <MovieEditor
            changeEditing={changeEditing}
            movie={movie}
            editMovie={editMovie}
            deleteMovie={deleteMovie}
        />,
    );
}

test("renders without crashing", () => {
    renderMovieEditor(jest.fn(), mockMovie);
});

test("save button works", () => {
    const mockEditMovie = jest.fn();
    renderMovieEditor(jest.fn(), mockMovie, mockEditMovie);
    fireEvent.click(screen.getByText(/save/i));

    expect(mockEditMovie).toHaveBeenCalled();
});

test("save handles empty released and rating fields", () => {
    const mockEditMovie = jest.fn();
    renderMovieEditor(jest.fn(), mockMovie, mockEditMovie);

    //Clear the fields so parseInt returns NaN, triggering the || 0
    fireEvent.change(screen.getByDisplayValue(String(mockMovie.released)), {
        target: { value: "" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "" },
    });

    fireEvent.click(screen.getByText(/save/i));

    expect(mockEditMovie).toHaveBeenCalledWith(
        mockMovie.id,
        expect.objectContaining({
            released: 0,
            rating: 0,
        }),
    );
});

test("cancel button works", () => {
    const mockChangeEditing = jest.fn();
    renderMovieEditor(mockChangeEditing, mockMovie);
    fireEvent.click(screen.getByText(/cancel/i));

    expect(mockChangeEditing).toHaveBeenCalled();
});

test("displays movie details", () => {
    renderMovieEditor(jest.fn(), mockMovie);

    expect(screen.getByDisplayValue(mockMovie.title)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockMovie.description)).toBeInTheDocument();
});
test("title field is editable", () => {
    renderMovieEditor(jest.fn(), mockMovie);

    fireEvent.change(screen.getByDisplayValue(mockMovie.title), {
        target: { value: "New Title" },
    });

    expect(screen.getByDisplayValue("New Title")).toBeInTheDocument();
});

test("release year field is editable", () => {
    renderMovieEditor(jest.fn(), mockMovie);

    fireEvent.change(screen.getByDisplayValue(String(mockMovie.released)), {
        target: { value: "2024" },
    });

    expect(screen.getByDisplayValue("2024")).toBeInTheDocument();
});

test("rating is editable", () => {
    renderMovieEditor(jest.fn(), mockMovie);

    fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "10" },
    });

    expect(screen.getByDisplayValue("⭐⭐⭐⭐⭐")).toBeInTheDocument();
});
test("description is editable", () => {
    renderMovieEditor(jest.fn(), mockMovie);

    fireEvent.change(screen.getByDisplayValue(String(mockMovie.description)), {
        target: { value: "A new description" },
    });

    expect(screen.getByDisplayValue("A new description")).toBeInTheDocument();
});

describe("MovieEditor Component", () => {
    const mockMovie: Movie = {
        id: "test-movie-123",
        title: "The Test Movie",
        rating: 8,
        description: "A movie for testing",
        released: 2020,
        soundtrack: [{ id: "song1", name: "Test Song", by: "Test Artist" }],
        watched: {
            seen: true,
            liked: true,
            when: "2023-01-01",
        },
    };

    const mockChangeEditing = jest.fn();
    const mockEditMovie = jest.fn();
    const mockDeleteMovie = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        render(
            <MovieEditor
                changeEditing={mockChangeEditing}
                movie={mockMovie}
                editMovie={mockEditMovie}
                deleteMovie={mockDeleteMovie}
            ></MovieEditor>,
        );
    });

    test("renders MovieEditor with initial movie data", () => {
        const title = screen.getByDisplayValue("The Test Movie");

        expect(title).toBeInTheDocument();
    });
});
