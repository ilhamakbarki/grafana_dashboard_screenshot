FROM deemetreeats11/alpine-google-fonts AS font_supply
RUN ls /usr/share/fonts/ && echo "done!"

FROM node:slim
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
USER root
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends
# RUN apt-get install culmus xfonts-efont-unicode xfonts-efont-unicode-ib xfonts-intl-european -y

RUN   rm -rf /var/lib/apt/lists/*

COPY --from=font_supply /usr/share/fonts/ /usr/share/fonts
# RUN git clone git://github.com/google/fonts.git /google-fonts

# RUN find /google-fonts -type f -name "*.ttf" -exec install -Dm644 {} /usr/share/fonts/truetype/google-fonts \;
# RUN find /usr/share/fonts -type f -name "*.ttf" -exec install -Dm644 {} /usr/share/fonts/truetype/google-fonts \;

ENV PORT 3001
EXPOSE 3001

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "start"]
