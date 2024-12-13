from rest_framework.response import Response
from rest_framework import status


def validate_pagination_params(page, limit):
    """
    Validates the pagination parameters.

    Args:
        page (str or int): The page number.
        limit (str or int): The number of items per page.

    Returns:
        dict: A dictionary containing 'page' and 'limit' if valid.
        Response: An error response object if validation fails.
    """
    if not page or not limit:
        return Response(
            {"detail": "Both 'page' and 'limit' fields are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        page = int(page)
        limit = int(limit)
    except ValueError:
        return Response(
            {"detail": "Both 'page' and 'limit' should be integers."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if limit < 1:
        return Response(
            {"detail": "'limit' should be greater than 0."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if page < 1 and page != -1:
        return Response(
            {"detail": "'page' should be greater than 0 or -1."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return {"page": page, "limit": limit}


def paginate_queryset(queryset, page, limit):
    """
    Paginates a given queryset based on the page and limit parameters.

    Args:
        queryset (QuerySet): The queryset to paginate.
        page (int): The current page number (-1 for the last page).
        limit (int): The number of items per page.

    Returns:
        QuerySet: The paginated queryset.
    """
    total_count = queryset.count()

    if page == -1:
        # Calculate the last page number
        last_page = (total_count // limit) + (1 if total_count % limit != 0 else 0)
        page = last_page

    start = (page - 1) * limit
    end = start + limit

    return queryset[start:end]


def filter_and_paginate_queryset(view_set, filters, page, limit):
    """
    Filters the queryset of a view_set, applies pagination, and serializes the results.

    Args:
        view_set (ViewSet): The ViewSet instance calling this function.
        filters (Q): Filters to apply to the queryset.
        page (int): The page number for pagination.
        limit (int): The number of items per page.

    Returns:
        Response: The paginated and serialized response.
    """
    # Access the queryset from the view_set
    queryset = view_set.queryset.filter(filters)

    # Apply pagination
    paginated_result = paginate_queryset(queryset, page, limit)

    # Serialize the paginated results using the view_set's serializer
    serializer = view_set.get_serializer(paginated_result, many=True)

    # Return the paginated and serialized response
    return Response(serializer.data, status=status.HTTP_200_OK)
