FROM nginx
ARG PORT_EXPOSE=80
COPY nginx.conf /etc/nginx/nginx.conf

COPY ./dist/ /etc/nginx/html
CMD ["nginx", "-g", "daemon off;"]
